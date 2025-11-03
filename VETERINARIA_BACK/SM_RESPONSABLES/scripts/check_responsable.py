import sqlite3
import sys

DB = 'db.sqlite3'
ID = 4

def main():
    try:
        conn = sqlite3.connect(DB)
        cur = conn.cursor()
        # Intentar con nombre de tabla por defecto 'api_responsables'
        try:
            cur.execute('PRAGMA table_info(api_responsables)')
            cols = cur.fetchall()
            table = 'api_responsables' if cols else None
        except Exception:
            table = None

        # Si no existe, intentar la tabla 'responsables' (por si Meta estuvo mal)
        if not table:
            try:
                cur.execute('PRAGMA table_info(responsables)')
                cols = cur.fetchall()
                table = 'responsables' if cols else None
            except Exception:
                table = None

        if not table:
            print('No se encontró la tabla de responsables en la BD.')
            sys.exit(2)

        cur.execute(f"SELECT * FROM {table} WHERE id_responsable=?", (ID,))
        row = cur.fetchone()
        if row:
            print('OK: Responsable encontrado:')
            print(row)
            # mostrar nombres de columnas
            cur.execute(f"PRAGMA table_info({table})")
            cols = [c[1] for c in cur.fetchall()]
            print('columns =', cols)
            sys.exit(0)
        else:
            print('NO: No existe responsable con id', ID)
            sys.exit(1)

    except sqlite3.Error as e:
        print('Error SQLite:', e)
        sys.exit(3)

if __name__ == '__main__':
    main()
