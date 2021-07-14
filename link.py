import cherrypy
import os.path
import sqlite3
import json
import wave
import numpy
import pyaudio
from struct import pack
from math import sin, pi

cherrypy.config.update({'server.socket_port': 10003,})

#diretorio do root
baseDir = os.path.dirname(os.path.abspath(__file__))

#Ligacao das pastas
config = {
  "/":     { "tools.staticdir.root": baseDir },
  "/js":   { "tools.staticdir.on": True,
             "tools.staticdir.dir": "js" },
  "/css":  { "tools.staticdir.on": True,
             "tools.staticdir.dir": "css" },
  "/html": { "tools.staticdir.on": True,
             "tools.staticdir.dir": "html" },
  "/img": { "tools.staticdir.on": True,
              "tools.staticdir.dir": "img" },
  "/musica": { "tools.staticdir.on": True,
              "tools.staticdir.dir": "musica" }
}

class Root(object):

    #abertura inicial
    @cherrypy.expose
    def index(self):
        return open("html/index.html").read()# primeiro html a abrir

    #abertura login
    @cherrypy.expose
    def login(self, username=None):
        if(username==""):
            return open("html/index.html").read()
        else:
            return open("html/music.html").read()

    #abertura music
    @cherrypy.expose
    def music(self):
        return open("html/music.html").read()

    #abertura excertos
    @cherrypy.expose
    def excertos(self):
        return open("html/excertos.html").read()

    #abertura mix
    @cherrypy.expose
    def mix(self):
        return open("html/mix.html").read()

    #abertura about
    @cherrypy.expose
    def about(self):
        return open("html/about.html").read()

    #criacao das tables onload
    #usando data da database
    @cherrypy.expose
    def sql(self, type):
        dataBase = sqlite3.connect('database.db')
        #entra quando for music.html
        if(type == "music_table"):
            result = dataBase.execute("SELECT * FROM music_table")
            rows = result.fetchall()
            dict = []
            i = 0
            #passar de sql para json
            for row in rows:
                dict.append({})
                dict[i]["id"] = row[0]
                dict[i]["music"] = row[1]
                dict[i]["artist"] = row[2]
                dict[i]["votes"] = row[3]
                dict[i]["people"] = row[4]
                i = i + 1
            #enviar json para o js
            return (json.dumps(dict, indent=4))
        #entra quando for excertos.html ou mix.html
        elif(type == "excertos_table"):
            result = dataBase.execute("SELECT * FROM excertos_table")
            rows = result.fetchall()
            dict = []
            i = 0
            #passar de sql para json
            for row in rows:
                dict.append({})
                dict[i]["id"] = row[0]
                dict[i]["instrument"] = row[1]
                dict[i]["name_file"] = row[2]
                i = i + 1
            #enviar json para o js
            return (json.dumps(dict, indent=4))

    #atualizacao dos votos e numero total de votos na database
    #return deste valor para o js
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def vote(self, id, votes):
        if(int(votes)==1 or int(votes)==-1):
            dataBase = sqlite3.connect('database.db')
            #buscar valores
            row = dataBase.execute("SELECT votes FROM music_table WHERE id="+id)
            people = dataBase.execute("SELECT people FROM music_table WHERE id="+id)
            result1 = people.fetchone()
            result = row.fetchone()
            result1 = result1[0] + 1
            result= result[0]
            #adcicao ou subtracao dos votos
            if(int(votes)==1):
                result = result + int(votes)
            elif(int(votes)==-1 and int(result)>0):
                result = result + int(votes)
            else:
                print("ERROO")
            #update dos valores na database
            dataBase.execute("UPDATE music_table SET votes="+str(result)+" WHERE id="+id)
            dataBase.execute("UPDATE music_table SET people="+str(result1)+" WHERE id="+id)
            dataBase.commit()
            dataBase.close()
        return result

        
    @cherrypy.expose
    def upload(self, myFile):
        #retira ".wav" do file
        file = myFile.filename.replace(".wav","")
        fo = open(os.getcwd()+ '/musica/' + myFile.filename, 'wb')
        while True:
            data = myFile.file.read(8192)
            if not data:
                break
            fo.write(data)
        dataBase = sqlite3.connect('database.db')
        #adciona nova row da tabela excertos
        dataBase.execute("INSERT INTO excertos_table(instrument, name_file) VALUES(?, ?);", (file, myFile.filename,))
        dataBase.commit()
        fo.close()

    #creates and adds file to database
    @cherrypy.expose
    def upload_pauta(self, json_dados):
        json_dados = json.loads(json_dados)
        myFile = self.criar_music(json_dados, 1024)
        #retira ".wav" do file
        file = myFile.filename.replace(".wav","")
        fo = open(os.getcwd()+ '/musica/' + myFile.filename, 'wb')
        while True:
            data = myFile.file.read(8192)
            if not data:
                break
            fo.write(data)
        dataBase = sqlite3.connect('database.db')
        #adciona nova row da tabela music
        dataBase.execute("INSERT INTO music_table(music, artist, votes, people) VALUES(?, 'jony', ?, ? );", (file, 0, 0,))
        dataBase.commit()
        fo.close()


    def criar_music(self, jason, frame_count):
        
        wf1 = jason['Excertos'][0]['music']
        wf2 = jason['Excertos'][1]['music']
        wf3 = jason['Excertos'][2]['music']
        wf4 = jason['Excertos'][3]['music']
        wf5 = jason['Excertos'][4]['music']
        wf6 = jason['Excertos'][5]['music']
        wf7 = jason['Excertos'][6]['music']
        
        wf1 = wave.open('musica/' + wf1, 'rb')
        wf2 = wave.open('musica/' + wf2, 'rb')
        wf3 = wave.open('musica/' + wf3, 'rb')
        wf4 = wave.open('musica/' + wf4, 'rb')
        wf5 = wave.open('musica/' + wf5, 'rb')
        wf6 = wave.open('musica/' + wf6, 'rb')   
        wf7 = wave.open('musica/' + wf7, 'rb')

       
        wfs = [wf1, wf2, wf3, wf4, wf5, wf6, wf7]

        with wave.open("musica/out5.wav", "wb") as stream:
            stream.setparams((1, 2, 22050, 0, "NONE", "not compressed"))

            newdata = None

            for wf in wfs:
                data = wf.readframes(frame_count)
                decodeddata = numpy.fromstring(data, numpy.int16)
                if(newdata is None):
                    newdata = decodeddata.astype(numpy.int16)
                else :
                    newdata = newdata + decodeddata.astype(numpy.int16)

            while len(newdata) > 0:
                stream.writeframes(newdata)

                newdata = None
                for wf in wfs:
                    data = wf.readframes(frame_count)
                    decodeddata = numpy.fromstring(data, numpy.int16)
                    if(newdata is None):
                        newdata = decodeddata.astype(numpy.int16)
                    else :
                        newdata = newdata + decodeddata.astype(numpy.int16)
        return newdata.tostring()

if __name__ == "__main__":
    cherrypy.quickstart(Root(), "/", config)
