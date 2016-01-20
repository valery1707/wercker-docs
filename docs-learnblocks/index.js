const window = require('global/window');
const slugify = require('slugificate');
const react = require('react');
const util = require('util');
var fs = require('fs');

const dom = react.DOM;
const blocks = [
  'basics',
  'containers',
  'pipelines',
  'steps'
];

var icons = {
  basics: fs.readFileSync(__dirname + '/icon-basics.svg', 'utf8'),
  containers: fs.readFileSync(__dirname + '/icon-containers.svg', 'utf8'),
  pipelines: fs.readFileSync(__dirname + '/icon-pipelines.svg', 'utf8'),
  steps: fs.readFileSync(__dirname + '/icon-steps.svg', 'utf8')
};

/**
 * Create class.
 */
module.exports = react.createClass({
  displayName: 'learnblocks',
  render: render
});

/**
 * Render.
 */
function render () {
  return dom.div({className: 'learnblocks ' + showIntro()},
    blocks.map(function (block) {
      return dom.div({className: createClassName(block), key: block},
        dom.a({
          className: 'learnblocks-item-icon ',
          href: '/learn/' + slugify(block) + '/introduction.html'
        },
        dom.span({
          className: 'learnblocks-item-icon',
          dangerouslySetInnerHTML: {
            __html: icons[block]
          }
        }),
        dom.span({
          className: 'learnblocks-item-title',
          children: block
        }))
      );
    })
  );
}

/**
 * Create className.
 *
 * @param {String} block
 */
function createClassName (block) {
  const head = window.location.pathname.split('/')[2];
  const active = (head === slugify(block));
  const blockName = block.replace(/(\.)/gm, '_');

  return util.format('learnblocks-item learnblocks-item_%s%s', blockName, (active ? ' active' : ''));
}

/**
 * Set local storage to only show intro once
 */
function showIntro () {
  if (window.localStorage.getItem('learnblocks-intro') !== 'true') {
    window.localStorage.setItem('learnblocks-intro', 'true');
    return 'intro';
  } else {
    return '';
  }
}
