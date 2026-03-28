"use client";

import { motion } from "framer-motion";
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TimelineContentProps extends React.HTMLAttributes<HTMLElement> {
  animationNum: number;
  timelineRef: React.RefObject<HTMLElement | null>;
  customVariants: any;
  as?: React.ElementType;
}

export const TimelineContent = forwardRef<HTMLElement, TimelineContentProps>(
  (
    {
      className,
      animationNum,
      timelineRef,
      customVariants,
      as: Component = "div",
      children,
      ...props
    },
    ref
  ) => {
    // Determine the element tag for motion, e.g., motion.div, motion.h2
    const MotionComponent = motion.create(Component as any);

    return (
      <MotionComponent
        ref={ref}
        className={cn(className)}
        variants={customVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ root: timelineRef, margin: "-10px", once: true }}
        custom={animationNum}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);
TimelineContent.displayName = "TimelineContent";
