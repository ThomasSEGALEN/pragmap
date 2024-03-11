import { BaseService } from '@/services'
import type { IRoadmap, IGetRoadMap, IPostRoadMap, IPutRoadMap } from '@/types'

class RoadMapService extends BaseService<IRoadmap, IGetRoadMap, IPostRoadMap, IPutRoadMap> {}

export const roadMapService = new RoadMapService('user')
