from pipeline import Pipeline

class ProfilePipeline(Pipeline):

    def __init__(self):
        super(ProfilePipeline, self).__init__("profile.json")

    def load(self):
        """
            Load to database
        """

        user_fields = self.database_fields['platform_user']


        return

    def save(self, data):

        self.data = data

        self.transform()


        return