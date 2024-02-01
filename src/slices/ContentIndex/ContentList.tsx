"use client";
import { Content, asImageSrc, isFilled } from "@prismicio/client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { gsap } from "gsap";

type ContentListProps = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[];
  contentType: Content.ContentIndexSlice["primary"]["content_type"];
  fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"];
  viewMoreText: Content.ContentIndexSlice["primary"]["view_more_text"];
};

export default function ContentList({
  items,
  contentType,
  fallbackItemImage,
  viewMoreText = "Read More",
}: ContentListProps) {
  const component = useRef(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  const revealRef = useRef(null);
  const [currentItem, setCurrentItem] = useState<null | number>(null);
  const [hovering, setHovering] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const urlPrefix = contentType === "Blog" ? "/blog" : "/project";

  useEffect(() => {
    // Animate list-items in with a stagger
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            stagger: 0.2,
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=150px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          }
        );
      });

      return () => ctx.revert(); // cleanup!
    }, component);
  }, []);

  useEffect(() => {
    // Mouse move event listener
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };
      // Calculate speed and direction
      const speed = Math.sqrt(
        Math.pow(Math.abs(mousePos.x - lastMousePos.current.x), 3)
      );

      let ctx = gsap.context(() => {
        // Animate the image holder
        if (currentItem !== null) {
          const maxY = window.scrollY + window.innerHeight - 350;
          const maxX = window.innerWidth - 250;

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1), // Apply rotation based on speed and direction
            ease: "back.out(2)",
            duration: 1.3,
          });
          gsap.to(revealRef.current, {
            opacity: hovering ? 1 : 0,
            visibility: "visible",
            ease: "power3.out",
            duration: 0.4,
          });
        }
        lastMousePos.current = mousePos;
        return () => ctx.revert(); // cleanup!
      }, component);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hovering, currentItem]);

  const onMouseEnter = (index: number) => {
    setCurrentItem(index);
    if (!hovering) setHovering(true);
  };

  const onMouseLeave = () => {
    setHovering(false);
    setCurrentItem(null);
  };

  const contentImages = items.map((item) => {
    const image = isFilled.image(item.data.hover_image)
      ? item.data.hover_image
      : fallbackItemImage;
    return asImageSrc(image, {
      fit: "crop",
      w: 220,
      h: 320,
      exp: -15,
    });
  });

  // ! Preload images
  // ! Before viewable
  useEffect(() => {
    contentImages.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [contentImages]);

  return (
    <div>
      <ul
        className="grid border-b border-b-emerald-200"
        onMouseLeave={onMouseLeave}
      >
        {items.map((item, idx) => (
          <>
            {isFilled.keyText(item.data.title) && (
              <li
                key={idx}
                ref={(el) => (itemsRef.current[idx] = el)}
                onMouseEnter={() => onMouseEnter(idx)}
                className="list-item opacity-0"
              >
                <Link
                  href={urlPrefix + "/" + item.uid}
                  className="flex flex-col justify-between md:flex-row
              border-t py-6
               border-t-teal-100 text-stone-300"
                  aria-label={item.data.title}
                >
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold">
                      {item.data.title}
                    </span>
                    <div className="flex gap-2 text-teal-400 text-md font-bold">
                      {item.tags.map((tag, idx) => (
                        <span key={idx}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto flex text-lg font-medium items-center gap-1 md:ml-0">
                    {viewMoreText}
                    <MdArrowBack className="font-bold" />
                  </span>
                </Link>
              </li>
            )}
          </>
        ))}
        {/* Hover element */}
        <div
          className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[320px] w-[220px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
          style={{
            backgroundImage:
              currentItem !== null ? `url(${contentImages[currentItem]})` : "",
          }}
          ref={revealRef}
        ></div>
      </ul>
    </div>
  );
}
