"""
Testing functions in user.py
"""

from ..user import User
from flask_bcrypt import generate_password_hash, check_password_hash

def main():

    test_email = "email@email.com"
    test_password = "password"

    user = User()
    # test adding a new user
    print("Saving new user into db")
    user_id = user.save(test_email, generate_password_hash(test_password))

    print("user.id: {}".format(user.id))
    print("user_id: {}".format(user_id))

    # test login
    print("Testing login")
    new_user = User()
    pw_hash = new_user.get_password_hash(test_email)
    validate = check_password_hash(pw_hash, test_password)
    print("Password validated: {}".format(validate))
    user_info = new_user.get_user_from_email(test_email)
    token = new_user.generate_auth_token(user_info[0]['id'])

    print(user_info)
    print(token)

    # test verifying token
    print("Testing verification of token")
    user2 = User()
    user2_info = user2.verify_token(token)
    print(user2_info)

    # test

if __name__ == '__main__':
    main()
