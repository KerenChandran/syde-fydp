"""
    Script to test database connection. Used during container networking setup.
"""

import psycopg2 as pg

def connect():
    """
        Method to connect to postgres database instance.
    """
    conn = pg.connect(user="postgres", host="db", password="sydefydp")

    return conn.cursor()

def main():
    """
        Main method.
    """
    crs = connect()
    return True


if __name__ == "__main__":
    print main()
