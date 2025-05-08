export function isElementInContainerViewport(
  el: HTMLElement | SVGPolygonElement,
  container: HTMLElement,
  offset: number = 0
): boolean {
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // 计算垂直方向的重叠区域高度
  const overlapTop = Math.max(elRect.top, containerRect.top);
  const overlapBottom = Math.min(elRect.bottom, containerRect.bottom);
  const overlapHeight = overlapBottom - overlapTop;
  // 如果重叠高度 ≥ offset，返回 true
  return overlapHeight > offset;
}

export function scrollIntoViewIfNeeded(
  el?: HTMLElement | SVGPolygonElement,
  container?: HTMLElement,
  scrollArgs?: boolean | ScrollIntoViewOptions,
  offset = 0
) {
  if (!el || !container) {
    return;
  }
  if (isElementInContainerViewport(el, container, offset || 0)) {
    return;
  }
  el.scrollIntoView(scrollArgs);
}
