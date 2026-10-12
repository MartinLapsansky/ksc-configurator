// Jest asset stub. Replaces image imports so Node tests don't try to parse
// binary image files. Provides a minimal Next.js `StaticImageData`-like shape.
module.exports = {
  src: "/test-file-stub",
  height: 1,
  width: 1,
};