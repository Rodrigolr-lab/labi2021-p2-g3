import cherrypy
import os.path
import sqlite3
import json

baseDir = os.path.dirname(os.path.abspath(__file__))

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

    @cherrypy.expose
    def index(self):
        return open("html/index.html").read()

    @cherrypy.expose
    def login(self, username=None):
        if(username==""):
            return open("html/index.html").read()
        else:
            return open("html/music.html").read()

    @cherrypy.expose
    def music(self):
        return open("html/music.html").read()
    
    @cherrypy.expose
    def excertos(self):
        return open("html/excertos.html").read()

    @cherrypy.expose
    def mix(self):
        return open("html/mix.html").read()
    
    @cherrypy.expose
    def about(self):
        return open("html/about.html").read()

    @cherrypy.expose
    def list(self, type):
      dataBase = sqlite3.connect('database.db')

      if(type == "music_table"):
        result = dataBase.execute("SELECT * FROM music_table")
        rows = result.fetchall()
        dict = []
        i = 0
        for row in rows:
            dict.append({})
            dict[i]["id"] = row[0]
            dict[i]["music"] = row[1]
            dict[i]["artist"] = row[2]
            dict[i]["votes"] = row[3]
            dict[i]["persons"] = row[4]
            i = i + 1
        return (json.dumps(dict, indent=4))

    @cherrypy.expose
    def vote(self, id, votes):
        if(int(votes)==1 or int(votes)==-1):
            dataBase = sqlite3.connect('database.db')
            c = dataBase.cursor()
            result = c.execute("SELECT votes FROM music_table WHERE"+id)
            if(int(votes)==1):
                result = int(result) + votes
                c.execute("UPDATE music_table SET votes="+result+"WHERE id="+id)
            elif(int(votes)==-1):
                result = int(result) + votes
                c.execute("UPDATE music_table SET votes="+result+"WHERE id="+id)
            else:
                print("ERROO")
        return result



if __name__ == "__main__":
    cherrypy.quickstart(Root(), "/", config)