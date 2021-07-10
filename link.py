import cherrypy
import os.path

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
  "/songs": { "tools.staticdir.on": True,
              "tools.staticdir.dir": "songs" }
}

class Root(object):

    @cherrypy.expose
    def index(self):
        return open("index.html").read()

    @cherrypy.expose
    def login(self, username=None):
        if(username==""):
            return open("index.html").read()
        else:
            return open("music.html").read()
            
    @cherrypy.expose
    def music(self):
        return open("music.html").read()
    
    @cherrypy.expose
    def excertos(self):
        return open("excertos.html").read()

    @cherrypy.expose
    def mix(self):
        return open("mix.html").read()
    
    @cherrypy.expose
    def about(self):
        return open("about.html").read()



if __name__ == "__main__":
    cherrypy.quickstart(Root(), "/", config)
