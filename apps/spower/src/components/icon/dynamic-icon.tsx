import * as LucideIcons from 'lucide-react';

import React from 'react';

export type DynamicIconProps = {
  svgContent?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  fallback?: boolean;
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  svgContent,
  className,
  style,
  onClick,
  fallback = true
}) => {
  if (!svgContent && !fallback) {
    return null;
  }

  if (svgContent) {
    const processedSvg = svgContent
      .replace(/<svg/, '<svg width="100%" height="100%"')
      .replace(/width="([^"]+)"/, 'width="100%"')
      .replace(/height="([^"]+)"/, 'height="100%"')
      .replace(/viewBox="([^"]*)"/, (match, viewBox) => {
        return viewBox ? match : `viewBox="0 0 24 24"`;
      });

    return (
      <span
        className={className}
        style={style}
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
    );
  }

  if (fallback) {
    const IconComponent = LucideIcons.HelpCircleIcon;

    return (
      <span className={className} style={style} onClick={onClick}>
        <IconComponent className="h-full w-full" />
      </span>
    );
  }

  return null;
};
