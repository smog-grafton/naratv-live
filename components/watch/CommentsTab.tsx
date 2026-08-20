'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, ThumbsUp, User } from 'lucide-react';
import { addVideoComment, getStoredToken, getVideoComments, VideoComment } from '@/services/home';

export default function CommentsTab({ videoSlug }: { videoSlug: string }) {
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const token = getStoredToken();

  useEffect(() => {
    getVideoComments(videoSlug).then(setComments).catch((err) => setError(err instanceof Error ? err.message : 'Comments could not be loaded.'));
  }, [videoSlug]);

  const handleComment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim() || !token) return;
    addVideoComment(videoSlug, newComment.trim(), token).then((comment) => {
      setComments((current) => [comment, ...current]);
      setNewComment('');
    }).catch((err) => setError(err instanceof Error ? err.message : 'Comment could not be posted.'));
  };

  return (
    <div className="flex w-full max-w-4xl flex-col gap-6 pt-4">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4"><MessageSquare className="h-5 w-5 text-gray-400" /><h3 className="text-sm font-bold uppercase tracking-wider text-white">{comments.length} Comments</h3></div>
      {error && <p className="border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      {token ? (
        <form onSubmit={handleComment} className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"><User className="h-5 w-5 text-gray-400" /></div><div className="flex flex-1 flex-col gap-2"><textarea placeholder="Add a comment..." value={newComment} onChange={(event) => setNewComment(event.target.value)} className="min-h-[48px] w-full resize-none border-b border-white/20 bg-transparent py-2 text-sm text-white placeholder-gray-500 focus:border-[#45E3FF] focus:outline-none" rows={2} />{newComment.trim() && <div className="flex justify-end"><button type="submit" className="rounded-sm bg-[#45E3FF] px-6 py-2 text-xs font-bold uppercase text-black hover:bg-white">Comment</button></div>}</div></form>
      ) : <p className="border border-white/5 bg-white/5 px-4 py-3 text-sm text-gray-400">Sign in to leave a comment.</p>}
      <div className="flex flex-col gap-6">
        {comments.length === 0 && !error ? <p className="text-sm text-gray-500">No comments yet. Start the conversation.</p> : comments.map((comment) => <div key={comment.id} className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"><User className="h-5 w-5 text-gray-400" /></div><div><div className="flex items-baseline gap-2"><span className="text-sm font-bold text-gray-200">{comment.user?.name || 'NaraTV viewer'}</span><span className="text-xs text-gray-500">{comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}</span></div><p className="text-sm leading-relaxed text-gray-300">{comment.body}</p><button className="mt-1 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white"><ThumbsUp className="h-3.5 w-3.5" />{comment.likes_count || 0}</button></div></div>)}
      </div>
    </div>
  );
}
