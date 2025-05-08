/**
 * 预览与解析结果联动逻辑
 */

import React, { useState } from "react";

export const useContentLinkage = ({
  viewContainerRef,
  resultContainerRef,
}: {
  viewContainerRef: React.RefObject<HTMLElement | null>;
  resultContainerRef: React.RefObject<HTMLElement | null>;
}) => {
  const [activeContentId, setActiveContentId] = useState("");
  const [activeParentContentId, setActiveParentContentId] = useState("");

  const registerLinkage = () => {
    if (!viewContainerRef.current || !resultContainerRef.current) {
      return;
    }
    viewContainerRef.current.addEventListener("click", handleClick);
    resultContainerRef.current.addEventListener("click", handleClick);
  };

  const handleClick = (e: any) => {
    const targetContent = findTargetContentId(e.target, e.currentTarget);
    const targetContentId = targetContent?.dataset?.contentId;
    const targetParentContentId =
      targetContent?.dataset?.parentContentId || targetContentId;
    if (targetParentContentId) {
      setActiveParentContentId(targetParentContentId);
    }

    if (targetContentId) {
      setActiveContentId(targetContentId);
    }
  };

  const findTargetContentId = (
    target: HTMLElement,
    container: HTMLElement
  ): HTMLElement | null => {
    let currentElement: HTMLElement | null = target;
    while (currentElement && currentElement !== container) {
      if (currentElement.hasAttribute("data-content-id")) {
        return currentElement;
      }
      currentElement = currentElement.parentElement;
    }
    return null;
  };

  return {
    activeContentId,
    setActiveContentId,
    activeParentContentId,
    setActiveParentContentId,
    registerLinkage,
  };
};
