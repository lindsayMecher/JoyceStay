//Listings

export const createListing = (listing) => {
  return $.ajax({
    url: '/api/listings',
    method: "POST",
    data: listing,
    contentType: false,
    processData: false,
    error: (err) => console.log(err)
  })
};

export const fetchListing = (id) => {
  return $.ajax({
    url: `/api/listings/${id}`,
    method: "GET",
    error: (err) => console.log(err)
  })
};

export const fetchListings = (bounds) => {
  console.log({bounds});
  return $.ajax({
    url: '/api/listings',
    method: "GET",
    data: {bounds},
    error: (err) => console.log(err)
  })
};

export const fetchUserListings = (id) => {
  return $.ajax({
    url: `/api/users/${id}/listings`,
    method: "POST",
    error: (err) => console.log(err)
  })
};

export const destroyListing = (id) => {
  return $.ajax({
    url: `/api/listings/${id}`,
    method: "DELETE"
  })
};

export const updateListing = (listing) => {
  return $.ajax({
    url: `/api/listings/${listing.get('listing[id]')}`,
    method: "PATCH",
    data: listing,
    contentType: false,
    processData: false,
    error: (err) => console.log(err)
  })
};

//Amenities / Home Types

export const fetchAmenitiesAndHomeTypes = () => {
  return $.ajax({
    url: '/api/amenities',
    method: "GET",
    error: (err) => console.log(err)
  })
};

export const fetchHomeTypes = () => {
  return $.ajax({
    url: '/api/home_types',
    method: "GET",
    error: (err) => console.log(err)
  })
};