"""
    Database utility functions.
"""
import os

import psycopg2 as pg

class Cursor:
    """
        Postgres Database connection wrapper. Attempts error-free connection
        to database. Constructor returns Cursor() instance with underlying
        connection, cursor, and execution methods.
    """

    def __init__(self):
        # defaults for postgres database connection
        self.dbhost = \
            os.environ['PG_HOST'] if 'PG_HOST' in os.environ else "db"
        self.dbuser = \
            os.environ['PG_USER'] if 'PG_USER' in os.environ else "postgres"
        self.dbpass = \
            os.environ['PG_PASS'] if 'PG_PASS' in os.environ else "password"

        try:
            self.conn = pg.connect(host=self.dbhost, user=self.dbuser, 
                                   password=self.dbpass)
        except:
            self.conn = None

        self.crs = conn.cursor() if self.conn is not None else None


    def get_cols(self):
        """
            Helper function to get resultant columns from an executed query.
        """
        return [desc[0] for desc in self.crs.description]


    def check_record_present(self, query):
        """
            Function to check whether a single record is present in the
            designated table, by executing query and checking if result set is
            empty.

            Parameters
            ----------
            query : {str}
                SQL-compatible query string
        """
        if self.crs is None:
            return None # non-boolean returned here to denote error

        self.crs.execute(query)

        result = self.crs.fetchall()

        return len(result) > 0


    def fetch_first(self, query):
        """
            Function which executes designated query and fetches the first
            resultant data point. Most frequently used with 'RETURNING' queries.

            Parameters
            ----------
            query : {str}
                SQL-compatible query string
        """
        self.crs.execute(query)

        result = self.crs.fetchall()

        return result[0][0]


    def fetch_dict(self, query):
        """
            Function to get query result as a dictionary. Combines query
            execution and result fetching.

            Parameters
            ----------
            query : {str}
                SQL-compatible query string
        """
        self.crs.execute(query)

        cols = self.get_cols()

        result = self.crs.fetchall()

        return dict(zip(cols, result))


if __name__ == '__main__':
    crs = Cursor()    
