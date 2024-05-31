const axios = require("axios");
const cheerio = require("cheerio");

async function fetch(url) {
  try {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  } catch (error) {
    console.error(`Error fetching the URL: ${error.message}`);
    throw new Error("Failed to fetch the URL");
  }
}

function analyzetitle($) {
  const title = $("title").text();
  if (title.length > 60) {
    return "title is too long keep it under 60 characters";
  } else if (title.length === 0) {
    return "title is missing";
  }
  return "title is good";
}

function analyzedescription($) {
  const description = $('meta[name="description"]').attr("content");
  if (!description) {
    return "meta description is missing";
  } else if (description.length > 160) {
    return "meta description is too long keep it under 160 characters";
  }
  return "meta description is good";
}

function analyzeheadings($) {
  const headings = {
    h1: $("h1").length,
    h2: $("h2").length,
    h3: $("h3").length,
    h4: $("h4").length,
    h5: $("h5").length,
    h6: $("h6").length,
  };
  if (headings.h1 === 0) {
    return "no h1 tag found every page should have one h1 tag";
  } else if (headings.h1 > 1) {
    return "multiple H1 tags found there should be only one h1 tag per page";
  }
  return "headings are good";
}

function analyzeimages($) {
  const images = $("img");
  let miss = 0;
  images.each((i, img) => {
    if (!$(img).attr("alt")) {
      miss++;
    }
  });
  if (miss > 0) {
    return `${miss} images are missing alt attributes`;
  }
  return "all images have alt attributes";
}

async function analyzeseo(url) {
  try {
    const $ = await fetch(url);
    const report = {
      title: analyzetitle($),
      description: analyzedescription($),
      headings: analyzeheadings($),
      images: analyzeimages($),
    };
    return report;
  } catch (error) {
    console.error(`error analyzing SEO: ${error.message}`);
    return { error: "failed to analyze SEO" };
  }
}
module.exports = analyzeseo;