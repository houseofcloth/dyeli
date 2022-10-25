const CleanCSS = require('clean-css')
const htmlmin = require('html-minifier')
const yaml = require("js-yaml")
const marked = require('marked')

module.exports = function(eleventyConfig) {
  
  // Copyright year
  eleventyConfig.addShortcode("copyrightYear", () => `${new Date().getFullYear()}` )

  // YAML instead of JSON for _data
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents))

  // Markdown
  eleventyConfig.addFilter('marked', function(content) {
    return marked.parse(content)
  })

  // Inline CSS minify https://www.11ty.dev/docs/quicktips/inline-css/
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles
  })

  // Build date
  eleventyConfig.addGlobalData("buildDate", () => `${new Date().toString()}` );
  
  // https://www.11ty.dev/docs/config/#transforms-example-minify-html-output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if ( outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        ignoreCustomComments: [ /^ Date:(.*)/ ],
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
      })
      return minified
    }
    return content
  })

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "includes",
      layouts: "layouts",
      data: "data",
    }
  }

}
