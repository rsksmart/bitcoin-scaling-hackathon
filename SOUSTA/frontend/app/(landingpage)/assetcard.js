'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from '@material-tailwind/react'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function AssetCard({
  description,
  expectedYield,
  href,
  min,
  title,
  type,
  src,
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="h-80 m-0 rounded-none"
      >
        <img src={src} alt="img-blur-shadow" layout="fill" />
      </CardHeader>
      <CardBody>
        <Typography className="font-semibold mb-2 text-blue-900 text-4xl">
          {title}
        </Typography>
        <Typography className="font-normal text-blue-700">
          {description}
        </Typography>
      </CardBody>
      <div className="border-t grid grid-cols-3 p-6">
        <div className="border-r flex flex-col items-center">
          <Typography className="font-semibold mb-4 text-sm uppercase">
            Type of Fund
          </Typography>
          <Typography className="font-normal text-xl">{type}</Typography>
        </div>
        <div className="flex flex-col items-center">
          <Typography className="font-semibold mb-4 text-sm uppercase">
            Yield
          </Typography>
          <Typography className="font-normal text-xl">
            {expectedYield}
          </Typography>
        </div>
        <div className="border-l flex flex-col items-center">
          <Typography className="font-semibold mb-4 text-sm uppercase">
            Minimum Subscription
          </Typography>
          <Typography className="font-normal text-xl">{min}</Typography>
        </div>
      </div>
      <CardFooter className="border-t">
        <Link href={href} className="inline-block">
          <Button size="sm" variant="text" className="flex items-center gap-4">
            {`Learn More About ${title}`}
            <FontAwesomeIcon
              className="text-blue-900"
              style={{ height: 16, width: 16 }}
              icon={faArrowRight}
            />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
