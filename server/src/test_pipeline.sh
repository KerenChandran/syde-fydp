# convenience script to run pipeline tests
# workaround to fix relative imports issues
# usage: bash test_pipeline.sh <module_name>

python -m pipelines.tests.$1
