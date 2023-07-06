## 1. Design and implement a RESTful API for a Yelp-like application

Designed and implemented a RESTful API for a Yelp-like application.  This application will specifically be centered around businesses and user reviews of businesses in US cities.  The API supports the following resources and actions:

### Businesses

  * Users who own businesses should be able to add their businesses to the application.  When a business owner adds their business they will need to include the following information:
    * Business name
    * Business street address
    * Business city
    * Business state
    * Business ZIP code
    * Business phone number
    * Business category and subcategories (e.g. category "Restaurant" and subcategory "Pizza")

    The following information may also optionally be included when a new business is added:
      * Business website
      * Business email
  * Business owners may modify any of the information listed above for an already-existing business they own.
  * Business owners may remove a business listing from the application.
  * Users may get a list of businesses.  The representations of businesses in the returned list should include all of the information described above.  In a later assignment, we will implement functionality to allow the user to list only a subset of the businesses based on some filtering criteria, but for now, assume that users will only want to fetch a list of all businesses.
  * Users may fetch detailed information about a business.  Detailed business information will include all of the information described above as well as reviews of the business and photos of the business (which we discuss below).

### Reviews

  * Users may write a review of an existing business.  A review will include the following information:
    * A "star" rating between 0 and 5 (e.g. 4 stars)
    * An "dollar sign" rating between 1 and 4, indicating how expensive the business is (e.g. 2 dollar signs)
    * An optional written review
  * Users may modify or delete any review they've written.

### Photos

  * Users may upload image files containing photos of an existing business.  Each photo may have an associated caption.
  * Users may remove any photo they've uploaded, and they may modify the caption of any photo they've uploaded.

### Data by user

  * Users may list all of the businesses they own.
  * Users may list all of the reviews they've written.
  * Users may list all of the photos they've uploaded.




