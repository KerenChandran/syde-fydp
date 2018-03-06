from utils.db import Cursor
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer,
                          BadSignature, SignatureExpired)

# TODO: move this out
secret_key = "abkdjskfdl4238472cjhkdhf38"

class User:

    def __init__(self):
        self.crs = Cursor()
        self.id = None
        self.email = None
        self.user_dict = None

    # Properties and functions for Flask-Login stuff
    # @property
    # def is_active(self):
    #     return True
    #
    # @property
    # def is_authenticated(self):
    #     return True
    #
    # @property
    # def is_anonymouse(self):
    #     return False
    #
    # def get_id(self):
    #     # Flask-Login requires this to be unicode value
    #     return str(self.id).encode("utf-8").decode("utf-8")

    def get_user_from_id(self, user_id):
        """
        Given the user id, returns a dictionary of the record
        """
        self.id = user_id

        query = """
            SELECT *
            FROM platform_user
            WHERE id = {id}
        """.format(id=user_id)

        self.user_dict = self.crs.fetch_dict(query)

        return self.user_dict

    def get_user_from_email(self, email):
        """
        Given the email, returns a dictionary of the record
        """
        self.email = email

        query = """
            SELECT *
            FROM platform_user
            WHERE email = '{email}'
        """.format(email=email)

        self.user_dict = self.crs.fetch_dict(query)

        return self.user_dict

    def get_id_from_email(self, email):
        """
        Given the email, return the id
        """
        self.email = email

        query = """
            SELECT id
            FROM platform_user
            WHERE email='{email}'
        """.format(email=email)

        self.id = self.crs.fetch_first(query)

        return self.id

    def generate_auth_token(self, user_id):
        """
        Given the user id, generate an auth token
        """
        s = Serializer(secret_key)
        return s.dumps({"id": user_id})

    def verify_token(self, token):
        """
        Given a token, authenticates it and returns a dictionary of the profile
        record
        """
        s = Serializer(secret_key)
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None

        self.user_dict = self.get_user_from_id(data['id'])
        self.id = data['id']

        return self.user_dict

    def get_password_hash(self, email):
        """
        Given email, retrieve hashed password from database.
        Returns hashed password as string.
        """
        query = """
            SELECT user_password.password_hash
            FROM user_password LEFT JOIN platform_user
            ON user_password .user_id = platform_user.id
            WHERE platform_user.email = '{email}'
        """.format(email=email)

        password_hash = self.crs.fetch_first(query)

        return password_hash

    def save(self, email, password_hash):
        """
        Given a username and hashed password, saves a new user into the database
        or updates the existing user's password
        Returns the user_id if successful, otherwise returns None
        """

        # check if data is empty
        if (email is None) or (password_hash is None):
            return None

        # check if user with email already exists
        self.crs.execute("""
            SELECT id, email
            FROM platform_user
            WHERE email = '{email}'
        """.format(email=email))

        result = self.crs.fetch_all()
        print(result)

        # account already exists
        # update password
        if len(result) != 0:
            self.id = result[0][0]
            query = """
            UPDATE user_password
            SET password_hash = '{pw_hash}'
            WHERE user_id = {id}
            """.format(pw_hash=password_hash, id=self.id)
            self.crs.execute(query)
            return self.id

        # save into platform_user
        query = """
            INSERT INTO platform_user (email)
            VALUES ('{email}')
            RETURNING id
        """.format(email=email)

        self.id = self.crs.fetch_first(query)

        # save into password table
        query = """
            INSERT INTO user_password (user_id, password_hash)
            VALUES ({id}, '{password_hash}')
        """.format(id=self.id, password_hash=password_hash)

        self.crs.execute(query)
        self.crs.commit()

        # successful
        return self.id
