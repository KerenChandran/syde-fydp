from pipeline import Pipeline
from flask import g
import pdb

class ProfilePipeline(Pipeline):

    def __init__(self):
        super(ProfilePipeline, self).__init__("profile.json")

    def load(self, record):
        try:
            fields, profile_info = self.crs.sanitize(record)
            update_cols = zip(fields, profile_info)
            update_cols = ["%s=%s" % (tup[0], tup[1]) for tup in update_cols]
            query = """
                UPDATE platform_user
                SET {update_cols}
                WHERE id={user_id}
            """.format(update_cols=",".join(update_cols),
                       user_id=g.user['id'])
            self.crs.execute(query)
            return True
        except Exception as e:
            print(e)
            return False

    def run(self, data):

        try:
            self.data = data

            self.transform()

            profile_fields = self.database_fields['platform_user']

            df_input = self.df_transform[profile_fields]

            df_input.apply(lambda x: self.load(x), axis=1)

            self.crs.commit()
            return True

        except Exception as e:
            print(e)
            return False
