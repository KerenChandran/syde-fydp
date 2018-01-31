"""
    Module with class and module definitions specific to resource scheduling.
"""

from pipeline import Pipeline

class SchedulePipeline(Pipeline):
    def __init__(self):
        super(UploadPipeline, self).__init__("schedule.json")
