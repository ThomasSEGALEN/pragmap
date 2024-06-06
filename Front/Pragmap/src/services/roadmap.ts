import { api } from '@/main'
import router from '@/router'
import { sleep } from '@/lib/utils'
import { BaseService } from '@/services'
import type { IRoadmap, IGetRoadmap, IPostRoadmap, IPutRoadmap } from '@/types'

class RoadmapService extends BaseService<IRoadmap, IGetRoadmap, IPostRoadmap, IPutRoadmap> {
	public async update(id: string, data: IPutRoadmap): Promise<void> {
		const currentRoute = router.currentRoute.value.name

		await sleep()

		try {
			await api.put(`/${this.apiPath}/${id}`, data)
		} catch (error) {
			throw new Error('Update Error')
		}

		if (currentRoute === 'RoadmapsTasks') router.go(0)
	}
}

export const roadmapService = new RoadmapService('roadmap')
