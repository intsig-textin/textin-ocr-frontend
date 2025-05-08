export function getImgWidth(result: any, img: any) {
  if (result?.width) {
    return result?.width;
  } else if (result?.rotated_image_width) {
    if (!img) return result.rotated_image_width;
    // 卡证类，不同服务的之间image_angle/rotated_image_width/rotated_image_height的逻辑不统一，只能通过尽量兼容
    const { rotated_image_width: width, rotated_image_height: height } = result;
    const { naturalWidth, naturalHeight } = img;
    // 图片是否旋转
    if (Math.abs(width / height - naturalWidth / naturalHeight) <= 0.02) {
      // 宽高比例一致，未旋转
      return width;
    }
    return height;
  }
  if (!img) return 1;
  const { width, height, naturalWidth, naturalHeight } = img;
  // 图片是否旋转
  if (Math.abs(width / height - naturalWidth / naturalHeight) <= 0.02) {
    // 宽高比例一致，未旋转
    return img?.naturalWidth;
  }
  return img?.naturalHeight;
}
