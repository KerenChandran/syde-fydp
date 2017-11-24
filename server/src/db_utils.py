"""
    Database utility functions.
"""

import psycopg2 as pg

def connect():
    """
        Method to connect to postgres database instance.
    """
    # TODO: username and password passed as environment variables
    conn = pg.connect(host="db", user="postgres", password="sydefydp")

    return conn


if __name__ == '__main__':
    crs = connect()
