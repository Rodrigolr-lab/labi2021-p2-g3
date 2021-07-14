import cherrypy
import os.path
import sqlite3
import json

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

    #receives file
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
        #adciona nova row da tabela
        dataBase.execute("INSERT INTO excertos_table(instrument, name_file) VALUES(?, ?);", (file, myFile.filename,))
        dataBase.commit()
        fo.close()

    @cherrypy.expose
    def upload_pauta(self, json_dados):
        print("-------------------------------------------------------------------------------------------------------------------------------------------")
        print(json_dados)
        file = self.criar_music(json_dados)
        #retira ".wav" do file
        file = json_dados.filename.replace(".wav","")
        fo = open(os.getcwd()+ '/musica/samples/' + file.filename, 'wb')
        while True:
            data = file.file.read(8192)
            if not data:
                break
            fo.write(data)
        dataBase = sqlite3.connect('database.db')
        #adciona nova row da tabela
        dataBase.execute("INSERT INTO music_table(music, artist, votes, people) VALUES('manel', 'jony', ?, ? );", (0, 0,))
        dataBase.commit()
        
        fo.close()

    def criar_music(self, jason):
        print("  RICKI RICKI RICKI RICKI RICKI RICKIhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
        wf = wave.open("YYY.wav", 'rb')
        wf1 = wave.open("XXX.wav", 'rb')
        data1 = wf.readframes(frame_count)
        data2 = wf1.readframes(frame_count)
        decodeddata1 = numpy.fromstring(data1, numpy.int16)
        decodeddata2 = numpy.fromstring(data2, numpy.int16)
        newdata = (decodeddata1 * 0.5 + decodeddata2* 0.5).astype(numpy.int16)
        return (result.tostring(), pyaudio.paContinue)



if __name__ == "__main__":
    cherrypy.quickstart(Root(), "/", config)