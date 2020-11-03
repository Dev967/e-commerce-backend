![node](markdown/icons/api.png)

### This is a full fledged REST API backend for **E-Commerce portal** made with **Node JS, MongoDB and Express JS**:

#
# Features
* **Mongo DB** as database
* File upload system using **Grid FS** and **Multer**
* User **authentication**    
* **Session** based presistant login system
* **Password Encryptio**n
* Protected **Routes**
* **CORS** and **CSRF** Protection
* Working **Tests** using **Mocha and Chai**
* Smooth Error handling
* **Well documentend code**

#
# Usage

install all dependencies using either `npm install` or `yarn install`
Configure **environment variables** in [.env](/.env) <br>
and you are done! <br>
**Now run the app using `npm start` or `yarn run start` `**

#
# Index

### Routes
There are **three** routes 
* [user](#User)
* [image](#Image)
* [product](#Product)

### Testing
* [testing](#Testing)

### Errors
* [errors](#Errors)

### Tasklist
* [tasks](#tasks)

# Routes

## User

| EndPoint     | Description                            | Type | request                                                                                                                                                                                                                                  | response                           | Constraints                                                                                                      |
| ------------ | -------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| /login       | returns a login page for user to login | GET  | `null`                                                                                                                                                                                                                                   | `HTML` File                        | null                                                                                                             |
| /login       | to login user                          | POST | **email**, **password**                                                                                                                                                                                                                  | `redirection`                      | user must not be logged in                                                                                       |
| /logout      | to logout user                         | GET  | `null`                                                                                                                                                                                                                                   | `redirection`                      | user must be logged in                                                                                           |
| /userDetails | to get user details                    | GET  | `null`                                                                                                                                                                                                                                   | `JSON`                             | user must be logged in                                                                                           |
| /register    | to register new user                   | POST | if **user_type** is *customer*: **email, username, password, gender, address, user_type**.<br> if **user_type** is *seller*: **email, username, password, gender, address, user_type**, **brandName**.(`NOTE: Case and Order sensitive)` | on error `JSON` else `redirection` | user must not exist already,<br> all fields must me be of same case and same order as in given in request column |

#
## Image
| EndPoint      | Description                                                   | Type | request                                     | response      | Constraints                                                   |
| ------------- | ------------------------------------------------------------- | ---- | ------------------------------------------- | ------------- | ------------------------------------------------------------- |
| /download/:id | create **download** or **read stream** and pipe to `response` | GET  | `id` param                                  | `read stream` | image must exist                                              |
| /delete       | to delete images                                              | POST | **user**(user id) and **subject**(image id) | `JSON`        | reserved only for application to access,<br> image must exist |

#
## Product
| EndPoint      | Description                                                                    | Type | request                                                                                           | response | Constraints                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------ | ---- | ------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| /             | to get all stored products                                                     | GET  | `null`                                                                                            | `JSON`   | `null`                                                                                                                                    |
| /findbyid/:id | to find product by `id`                                                        | GET  | `id` param                                                                                        | `JSON`   | product must exist                                                                                                                        |
| /search       | to search product based on specific criteria, like: *name, price, seller etc.* | GET  | `query` (only one)                                                                                | `JSON`   | `query` should be only one, <br> `query` should be valid, <br> product must exist                                                         |
| /delete/:id   | to delete product                                                              | POST | `id` param                                                                                        | `JSON`   | request maker should be a **seller account**, <br> product to delete must be the one uploaded by requesting user, <br> product must exist |
| /add          | to add products                                                                | POST | *NOTE: use `form-data`* <br> **name, category, price, color, rating, description** and **images** | `JSON`   | all fields must be of same order and same case, <br> product must not be uploaded by same vendor already                                  |

#
## Testing

run `npm test` or `yarn run test` after installing `dev-dependecies`

#
## Errors

all errors and responses(ones in `JSON`) are of format 

`{
 success: boolean,
 data: json,
 message: string
}`

#
## Tasks
 - [x] Routes
 - [x] File upload and delete manager
 - [x] User Authentication
 - [x] Securing API from **CORS** and **CSRF**
 - [ ] Generate **API key**
 - [ ] Testing

> Thank you very much for visiting this repository