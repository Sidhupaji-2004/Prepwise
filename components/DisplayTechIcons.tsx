import React from 'react'
import { getTechLogos } from '@/utils';
import Image from 'next/image';
const DisplayTechIcons = async ({techStack} : TechIconProps) => {
    const techIcons = await getTechLogos(techStack);
    return (
        <div className="flex flex-row gap-2">
            {techIcons.slice(0,3).map(({tech, url}, index) => (
                <Image key={index} src={url} alt={tech} width={100} height={100} className='rounded-lg size-5'/>
            ))}
        </div>
    )
}

export default DisplayTechIcons
// here we are using cdn.jsdelivr to fetch the tech icons improving performance metrics