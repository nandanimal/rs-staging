// Projects
export const featuredProjectsQuery = `*[_type == "project" && featured == true] | order(releaseDate desc) {
  _id, artist, title, slug, releaseDate, networks, coverPhoto
}`;

export const allProjectsQuery = `*[_type == "project"] | order(releaseDate desc) {
  _id, artist, title, slug, releaseDate, networks, starring, directedBy,
  description, url, merch, coverPhoto, mobileCoverPhoto, titleCard, videoPreview, category, featured
}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  _id, artist, title, slug, releaseDate, networks, starring, directedBy,
  description, url, merch, coverPhoto, mobileCoverPhoto, titleCard, videoPreview
}`;

// Events
export const allEventsQuery = `*[_type == "event" && date >= now()] | order(date asc) {
  _id, title, date, city, venue, ticketUrl, soldOut, startTime, description, coverPhoto
}`;

export const eventByIdQuery = `*[_type == "event" && _id == $id][0] {
  _id, title, date, city, venue, ticketUrl, soldOut, startTime, description, coverPhoto
}`;

// Articles
export const allArticlesQuery = `*[_type == "article"] | order(date desc) {
  _id, source, coverPhoto, title, url, date
}`;

export const articleByIdQuery = `*[_type == "article" && _id == $id][0] {
  _id, source, coverPhoto, title, url, date
}`;

// Project slugs for static paths
export const allProjectSlugsQuery = `*[_type == "project"] { "slug": slug.current }`;

// Adjacent projects for prev/next navigation (with _id tiebreaker + wrap-around)
export const adjacentProjectsQuery = `{
  "prev": *[_type == "project" && (
    releaseDate < $releaseDate ||
    (releaseDate == $releaseDate && _id < $id)
  )] | order(releaseDate desc, _id desc)[0] {
    _id, artist, title, slug
  },
  "next": *[_type == "project" && (
    releaseDate > $releaseDate ||
    (releaseDate == $releaseDate && _id > $id)
  )] | order(releaseDate asc, _id asc)[0] {
    _id, artist, title, slug
  },
  "first": *[_type == "project"] | order(releaseDate asc, _id asc)[0] {
    _id, artist, title, slug
  },
  "last": *[_type == "project"] | order(releaseDate desc, _id desc)[0] {
    _id, artist, title, slug
  }
}`;
