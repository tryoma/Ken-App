import { Comment } from '@/type';
import UserIconAndNameWithUserId from './UserIconAndNameWithUserId';
import { useState } from 'react';

interface Props {
  comments: Comment[];
}

const TeacherCommentList = ({ comments }: Props) => {
  const [openCommentIds, setOpenCommentIds] = useState<string[]>([]);

  const handleOpenComment = (id: string) => {
    if (openCommentIds.includes(id)) {
      setOpenCommentIds(openCommentIds.filter(commentId => commentId !== id));
    } else {
      setOpenCommentIds([...openCommentIds, id]);
    }
  };

  const isInclude = (id: string) => openCommentIds.includes(id);

  return comments.length > 0 ? (
    <div className="">
      <h2 className="text-xl font-bold mb-3">先生のコメント</h2>
      {comments.map(comment => (
        <div key={comment.id} className="mx-auto max-w-screen-2xl px-2">
          <div className="mx-auto flex max-w-screen-sm flex-col border-t">
            <div className="border-b">
              <div
                className="flex cursor-pointer justify-between gap-2 py-2 text-black"
                onClick={() => handleOpenComment(comment.id)}
              >
                <span className="font-semibold transition duration-100 md:text-lg">
                  <UserIconAndNameWithUserId userId={comment.userId} />
                </span>

                <span
                  className={`text-indigo-500 ${
                    isInclude(comment.id) ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>

              <div
                className={`mb-4 text-gray-500 ${
                  isInclude(comment.id) ? '' : 'hidden'
                }`}
              >
                <div className="px-3">
                  <p> Q. {comment.focusPoint}</p>
                </div>
                <div className="p-3 text-blue-500">
                  <p> A. {comment.text}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : null;
};

export default TeacherCommentList;
