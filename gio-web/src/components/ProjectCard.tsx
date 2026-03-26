import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from './AnimatedSection';
import { Project } from '@/types';
import PLACEHOLDER_IMAGE from '@/constants/placeholder';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <AnimatedSection key={project.id} delay={index * 100}>
      <Link
        to={`/projects/${project.id}`}
        className="group block overflow-hidden card-hover"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="aspect-[4/3] md:aspect-square overflow-hidden relative">
          <img
            src={project.coverImageId ? `/api/images/${project.coverImageId}/thumbnail` : PLACEHOLDER_IMAGE}
            alt={project.name}
            loading={index < 3 ? "eager" : "lazy"}
            fetchPriority={index < 3 ? "high" : "auto"}
            decoding="async"
            className={`w-full h-full object-cover img-zoom-hover ${imgLoaded ? 'img-loaded' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              setImgLoaded(true);
            }}
          />
          {/* 悬停遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* 悬停时显示详情 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span className="text-[#d4a853] text-xs tracking-[0.3em] uppercase border border-[#d4a853] px-6 py-3">查看详情</span>
          </div>
        </div>
        <div className="p-5 md:p-6">
          <h3 className="text-base md:text-lg font-light text-white mb-3 tracking-wide">{project.name}</h3>
          <div className="flex justify-between items-center text-xs tracking-wider" style={{ color: '#666666' }}>
            <span>{project.location}</span>
            <span>{project.year}</span>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
};

export default ProjectCard;