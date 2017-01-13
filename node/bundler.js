//   @todo

"use strict";

const ROLLUP = require('rollup');

class bundler {
     constructor() {
          let cache;
          ROLLUP.rollup({
               entry: 'public/javascripts/main.js',
               cache: cache
          }).then((bundle) => {
               let result = bundle.generate({
                    format: 'iife'
               });
               // cache = bundle;
               bundle.write({
                    format: 'iife',
                    dest: 'public/javascripts/bundle.js'
               });
          });
     }
}

module.exports = bundler;