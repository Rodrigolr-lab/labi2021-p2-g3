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
        return open("html/index.html").read()

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
    def list(self, type):
        dataBase = sqlite3.connect('database.db')
        #entra em se for music.html
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
                dict[i]["persons"] = row[4]
                i = i + 1
            return (json.dumps(dict, indent=4))
        #entra em se for excertos.html
        elif(type == "music_excertos"):
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
            return (json.dumps(dict, indent=4))

    #atualizacao dos votos na database
    #return deste valor para o js
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def vote(self, id, votes):
        if(int(votes)==1 or int(votes)==-1):
            dataBase = sqlite3.connect('database.db')
            row = dataBase.execute("SELECT votes FROM music_table WHERE id="+id)
            people = dataBase.execute("SELECT people FROM music_table WHERE id="+id)
            result1 = people.fetchone()
            result = row.fetchone()
            result1 = result1[0] + 1
            result= result[0]
            if(int(votes)==1):
                result = result + int(votes)
                dataBase.execute("UPDATE music_table SET votes="+str(result)+" WHERE id="+id)
            elif(int(votes)==-1 and int(result)>0):
                result = result + int(votes)
                dataBase.execute("UPDATE music_table SET votes="+str(result)+" WHERE id="+id)
            else:
                print("ERROO")
            
            dataBase.execute("UPDATE music_table SET people="+str(result1)+" WHERE id="+id)
            dataBase.commit()
            dataBase.close()
        return result



if __name__ == "__main__":
    cherrypy.quickstart(Root(), "/", config)