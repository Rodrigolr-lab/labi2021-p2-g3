import sqlite3 as sql
import sys


#Este programa n afeta o site de nenhuma forma
#Apenas da reset as tabelas da base de dados
def main(argv):
    db = sql.connect('database.db')
    if(argv[1]== "music_table"):
        print("Music restarted")
        db.execute("UPDATE music_table SET votes=0,people=0")
    elif(argv[1]== "excertos_table"):
        print("Excertos restarted")
        db.execute("DROP table excertos_table")
        db.execute("CREATE TABLE excertos_table(id INTEGER PRIMARY KEY AUTOINCREMENT, instrument TEXT, name_file TEXT)")
        db.execute("INSERT INTO excertos_table(instrument, name_file) VALUES('Unknown1', 'unknown1.wav')")
        db.execute("INSERT INTO excertos_table(instrument, name_file) VALUES('Unknown2', 'unknown2.wav')")
        db.execute("INSERT INTO excertos_table(instrument, name_file) VALUES('Unknown3', 'unknown3.wav')")
    else:
        print("Esta tabela nao existe")
    db.commit()


main(sys.argv)
