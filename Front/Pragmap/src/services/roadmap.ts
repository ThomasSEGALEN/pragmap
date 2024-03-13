import { BaseService } from '@/services'
import type { IRoadmap, IGetRoadmap, IPostRoadmap, IPutRoadmap } from '@/types'

class RoadmapService extends BaseService<IRoadmap, IGetRoadmap, IPostRoadmap, IPutRoadmap> {}

export const roadmapService = new RoadmapService('roadmap')
