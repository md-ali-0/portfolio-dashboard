import config from "@/config";
import { Hash, MessageCircle, Rss, Star, StarHalf, TabletSmartphone } from "lucide-react";
import Link from "next/link";

export default async function Statistics() {
    const res = await fetch(`${config.host}/api/statistics`, {
        cache: 'no-store'
    })
    const data = await res.json()
    const statisticsData = data?.data
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center mb-1">
                            <div className="text-2xl font-semibold">{statisticsData.specifications}</div>
                        </div>
                        <div className="text-sm font-medium text-orange-500">
                            Specifications
                        </div>
                    </div>
                    <div>
                        <TabletSmartphone className="text-orange-500" size={35}/>
                    </div>
                </div>
                <Link
                    href="/dashboard/specifications"
                    className="text-orange-500 font-medium text-sm hover:text-blue-500"
                >
                    View
                </Link>
            </div>
            <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center mb-1">
                            <div className="text-2xl font-semibold">{statisticsData.reviews}</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                            Review
                        </div>
                    </div>
                    <div>
                        <Star className="text-green-600" size={35}/>
                    </div>
                </div>
                <Link
                    href="/dashboard/reviews"
                    className="text-green-600 font-medium text-sm hover:text-blue-500"
                >
                    View
                </Link>
            </div>
            <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center mb-1">
                            <div className="text-2xl font-semibold">{statisticsData.posts}</div>
                        </div>
                        <div className="text-sm font-medium text-blue-500">
                            Blogs
                        </div>
                    </div>
                    <div>
                        <Rss className="text-blue-500" size={35}/>
                    </div>
                </div>
                <Link
                    href="/dashboard/posts"
                    className="text-blue-500 font-medium text-sm hover:text-blue-500"
                >
                    View
                </Link>
            </div>
            <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center mb-1">
                            <div className="text-2xl font-semibold">{statisticsData.comments}</div>
                        </div>
                        <div className="text-sm font-medium text-sky-500">
                            Comments
                        </div>
                    </div>
                    <div>
                        <MessageCircle className="text-sky-500" size={35}/>
                    </div>
                </div>
                <Link
                    href="/dashboard/comments"
                    className="text-sky-500 font-medium text-sm hover:text-blue-500"
                >
                    View
                </Link>
            </div>
            <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center mb-1">
                            <div className="text-2xl font-semibold">{statisticsData.ratings}</div>
                        </div>
                        <div className="text-sm font-medium text-amber-500">
                            Ratings
                        </div>
                    </div>
                    <div>
                        <StarHalf className="text-amber-500" size={35}/>
                    </div>
                </div>
                <Link
                    href="/dashboard/ratings"
                    className="text-amber-500 font-medium text-sm hover:text-blue-500"
                >
                    View
                </Link>
            </div>
            <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center mb-1">
                            <div className="text-2xl font-semibold">{statisticsData.brands}</div>
                        </div>
                        <div className="text-sm font-medium text-teal-500">
                            Brand
                        </div>
                    </div>
                    <div>
                        <Hash className="text-teal-500" size={35}/>
                    </div>
                </div>
                <Link
                    href="/dashboard/brands"
                    className="text-teal-500 font-medium text-sm hover:text-blue-500"
                >
                    View
                </Link>
            </div>
        </div>
    );
}
