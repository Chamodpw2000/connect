'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { FaHeart, FaComment, FaShare, FaEllipsisH } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { PostCardProps } from '@/types/posts';

const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onComment,
    onShare,
    onEdit,
    onDelete,
    currentUserEmail,
    className = '',
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showFullContent, setShowFullContent] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Helper function to safely check if author exists and has the required properties
    const hasAuthor = (author: any): author is { email: string; firstName: string; lastName?: string; image?: string } => {
        return typeof author === 'object' && author !== null && 'email' in author;
    };

    const isAuthor = hasAuthor(post.author) && currentUserEmail === post.author.email;
    
    const shouldTruncateContent = post.content.length > 300;
    const displayContent = shouldTruncateContent && !showFullContent
        ? post.content.substring(0, 300) + '...'
        : post.content;

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        onLike?.(post._id);
    };

    const formatDate = (date: string | Date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const nextImage = () => {
        if (post.images && post.images.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === post.images!.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (post.images && post.images.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? post.images!.length - 1 : prev - 1
            );
        }
    };

    return (
        <Card className={`w-full  mx-auto bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={hasAuthor(post.author) && post.author.image ? String(post.author.image) : ''}
                                alt={
                                    hasAuthor(post.author)
                                        ? `${post.author.firstName} ${post.author.lastName || ''}`
                                        : 'User Avatar'
                                }
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {hasAuthor(post.author) && post.author.firstName
                                    ? post.author.firstName.charAt(0).toUpperCase() + (post.author.lastName?.charAt(0).toUpperCase() || '')
                                    : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                                {hasAuthor(post.author)
                                    ? `${post.author.firstName} ${post.author.lastName || ''}`
                                    : 'Unknown User'}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {typeof post.author === 'object' && post.author !== null && 'role' in post.author
                                        ? (post.author as { role: string }).role
                                        : ''}
                                </span>
                                <span>•</span>
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {(isAuthor && onEdit && onDelete) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <FaEllipsisH className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {isAuthor && onEdit && (
                                    <DropdownMenuItem onClick={() => onEdit(post._id)}>
                                        Edit Post
                                    </DropdownMenuItem>
                                )}
                                {isAuthor && onDelete && (
                                    <DropdownMenuItem
                                        onClick={() => onDelete(post._id)}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        Delete Post
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Post Title */}
                {post.title && (
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        {post.title}
                    </h2>
                )}

                {/* Post Content */}
                <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {displayContent}
                    </p>
                    {shouldTruncateContent && (
                        <button
                            onClick={() => setShowFullContent(!showFullContent)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                        >
                            {showFullContent ? 'Show less' : 'Read more'}
                        </button>
                    )}
                </div>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                    <div className="mb-4 relative">
                        <div className="relative rounded-lg overflow-hidden bg-gray-100">
                            <Image
                                src={post.images[currentImageIndex]}
                                alt={`Post image ${currentImageIndex + 1}`}
                                width={600}
                                height={400}
                                className="w-full h-auto max-h-96 object-cover"
                            />

                            {post.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                                    >
                                        <FaArrowCircleLeft />

                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                                    >
                                        <FaArrowCircleRight />

                                    </button>
                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                        {post.images.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${isLiked
                                    ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                    : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
                                }`}
                        >
                            <FaHeart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm font-medium">
                                {likeCount > 0 ? likeCount : 'Like'}
                            </span>
                        </button>

                        <button
                            onClick={() => onComment?.(post._id)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <FaComment className="h-4 w-4" />
                            <span className="text-sm font-medium">Comment</span>
                        </button>

                        <button
                            onClick={() => onShare?.(post._id)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <FaShare className="h-4 w-4" />
                            <span className="text-sm font-medium">Share</span>
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PostCard;
