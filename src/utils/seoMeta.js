
module.exports = (title, content) => {
  return {
    metaTitle: title.length > 60 ? title.slice(0, 60) : title,
    metaDescription:
      content.length > 160 ? content.slice(0, 160) : content,
  };
};
