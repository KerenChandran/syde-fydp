"""
    Elasticsearch utility functions and classes.
"""
import os

from elasticsearch import Elasticsearch

class Connect:
    """
        Elasticsearch connection wrapper. Attempts error free connection to
        elasticsearch instance. Constructor returns Connect() object instance.
    """

    def __init__(self):
        self.es_host = \
            os.environ['ES_HOST'] if 'ES_HOST' in os.environ else "es"
        self.es_port = \
            int(os.environ['ES_PORT']) if 'ES_PORT' in os.environ else 9200

        try:
            self.es = \
                Elasticsearch([{'host': self.es_host, 'port': self.es_port}])
        except:
            self.es = None


if __name__ == '__main__':
    conn = Connect()
