import React from 'react';
import * as Icons from 'lucide-react';

interface IconMapperProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconMapper: React.FC<IconMapperProps> = ({ name, className = 'w-8 h-8', size = 32 }) => {
  // Check if icon is an emoji or URL
  if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('data:image')) {
    return <img src={name} alt="icon" className={`${className} object-contain`} style={{ width: size, height: size }} />;
  }

  // Check for lucide icon
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name];
  if (LucideIcon) {
    return <LucideIcon className={className} size={size} />;
  }

  // Fallback map for popular 90s icon keywords
  switch (name.toLowerCase()) {
    case 'pluscircle': case 'plus': return <Icons.PlusCircle className={className} size={size} />;
    case 'harddrive': case 'computer': return <Icons.HardDrive className={className} size={size} />;
    case 'code2': case 'code': return <Icons.Code2 className={className} size={size} />;
    case 'calculator': return <Icons.Calculator className={className} size={size} />;
    case 'globe': case 'web': return <Icons.Globe className={className} size={size} />;
    case 'filetext': case 'notepad': return <Icons.FileText className={className} size={size} />;
    case 'settings': case 'cog': return <Icons.Settings className={className} size={size} />;
    case 'trash2': case 'trash': return <Icons.Trash2 className={className} size={size} />;
    case 'folder': return <Icons.Folder className={className} size={size} />;
    case 'layoutgrid': return <Icons.LayoutGrid className={className} size={size} />;
    case 'terminal': return <Icons.Terminal className={className} size={size} />;
    case 'sparkles': return <Icons.Sparkles className={className} size={size} />;
    case 'link': case 'external': return <Icons.ExternalLink className={className} size={size} />;
    case 'play': case 'game': return <Icons.Gamepad2 className={className} size={size} />;
    case 'music': return <Icons.Music className={className} size={size} />;
    case 'image': return <Icons.Image className={className} size={size} />;
    case 'mail': return <Icons.Mail className={className} size={size} />;
    case 'info': return <Icons.Info className={className} size={size} />;
    default:
      // If it looks like an emoji or single character
      if (name.length <= 4) {
        return <span style={{ fontSize: `${size * 0.8}px` }} className="leading-none select-none">{name}</span>;
      }
      return <Icons.AppWindow className={className} size={size} />;
  }
};
