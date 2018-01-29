from server.src.pipelines.profile import ProfilePipeline

def main():

    profile = ProfilePipeline()

    test_input = {
        "first_name": "Julia",
        "last_name": "Zhang",
        "email": "email@email.com",
        "phone": "4165555555",
        "faculty": "Engineering",
        "department": "Systems Design"
    }

    profile.run([test_input])

if __name__ == '__main__':
    main()