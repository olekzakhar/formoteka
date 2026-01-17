import {
  Heading,
  AlignLeft,
  Type,
  FileText,
  Mail,
  Hash,
  ChevronDown,
  CheckSquare,
  Circle,
  Calendar,
  LucideIcon,
} from 'lucide-react';

const iconMap = {
  Heading,
  AlignLeft,
  Type,
  FileText,
  Mail,
  Hash,
  ChevronDown,
  CheckSquare,
  Circle,
  Calendar,
};

export const BlockIcon = ({ icon, className = '' }) => {
  const IconComponent = iconMap[icon] || Type;
  return <IconComponent className={className} />;
};
