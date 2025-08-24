'use client'
import { useState, useRef, useEffect } from 'react';
import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css';
import { useSession } from 'next-auth/react'
import { useCommentsStore } from '@/store/commentsHandler'
import {useParams} from 'next/navigation'
export default function Comments() {
  const { uploadComment , getComments , comments , finalComments , deleteComment , editComment , error } = useCommentsStore();
  const { data: session, status } = useSession();
  const user = session?.user;
  const {postid} = useParams();

  useEffect(() => {
    if (!postid) return;
    const id = decodeURIComponent(postid);
    getComments(id);
    
  }, [postid,getComments]);

  if (status === 'loading') return null; // or a skeleton/loader
  // Close emoji picker when clicking outside
  
const onSubmitAction = (data) => {

    const {text ,userId ,comId} = data;
    console.log(data);
    uploadComment({text:text , parentid:null ,userid:userId ,comId:comId,postid:postid});
   
}

const onReplyAction = (data) => {
  console.log(data);
  const {text ,userId ,comId , parentid} = data;
 
  // uploadComment({text:text , parentid:parentid ,userid:userId ,comId:comId,postid:postid});
}
const resolveMongoId = (comId) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(comId || '');
  if (isObjectId) return comId; // it's already a Mongo _id

  // try find by comId OR by stringified _id
  const match = (comments || []).find(
    (c) => c.comId === comId || String(c._id) === comId
  );
  return match?._id || null;
};

const onEditAction = async(data) => {
  const { comId , text } = data;
  const _id = resolveMongoId(comId);
  if (!_id) {
    console.error('Cannot find _id for comId:', comId);
    return;
  }
  await editComment(_id , text);
  await getComments(postid);
}

const onDeleteAction = async(data) => {
  const comId= data.comId;

  const match = (comments || []).find(c => c.comId === comId);
  if (!match?._id) {
    console.error('Cannot find _id for comId:', comId);
    return;
  }
  deleteComment(match?._id);
    getComments(postid);  
}

  return (

    <div className="w-full max-w-3xl mx-auto px-4 py-6 rcs-wrapper">
      <CommentSection
   
        currentUser={{
          currentUserId: user?.id || user?.sub || user?._id || 'guest',
          currentUserImg: user?.image || 'https://picsum.photos/200',
          currentUserProfile: user?.image || 'https://picsum.photos/200',
          currentUserFullName: user?.username || user?.name || 'Guest User'
        }}
        // Form Styling
        formStyle={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem',
          backgroundColor: '#1f2937',
          borderRadius: '0.75rem',
          border: '1px solid #374151',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        // Custom text area with emoji picker
        textFieldStyle={{
          position: 'relative',
          padding: '0',
          margin: '0',
          '& textarea': {
            border: '1px solid #4b5563',
            backgroundColor: '#111827',
            color: '#f3f4f6',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            paddingRight: '2.5rem',
            minHeight: '100px',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            width: '100%',
            resize: 'vertical',
            '&:focus': {
              outline: 'none',
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
            },
            '&::placeholder': {
              color: '#6b7280'
            }
          },
          '& .emoji-picker-button': {
            position: 'absolute',
            right: '0.75rem',
            bottom: '0.5rem',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            '&:hover': {
              color: '#3b82f6',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          },
          '& .emoji-picker': {
            position: 'absolute',
            right: '0',
            bottom: '100%',
            marginBottom: '0.5rem',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.5rem',
            zIndex: 50,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          },
          '& .emoji-option': {
            background: 'transparent',
            border: 'none',
            color: '#f3f4f6',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.1)'
            }
          }
        }}
        
        
        // Submit Button
        submitBtnStyle={{
          backgroundColor: '#2563eb',
          color: 'white',
          fontWeight: '500',
          padding: '0.5rem 1.25rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          alignSelf: 'flex-end',
          '&:hover': {
            backgroundColor: '#1d4ed8',
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        }}
        // Cancel Button
        cancelBtnStyle={{
          color: '#9ca3af',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          transition: 'all 0.2s',
          '&:hover': {
            color: '#f3f4f6',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          }
        }}
        // Comment Item
        commentItemStyles={{
          backgroundColor: '#1f2937',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          margin: '0.75rem 0',
          border: '1px solid #374151',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: '#4b5563',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
        // Comment Text
        commentTextStyle={{
          color: '#e5e7eb',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginTop: '0.5rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
        // Header (Title)
        titleStyle={{
          color: '#f9fafb',
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid #374151'
        }}
        // Reply/Edit/Delete Buttons
        replyInputStyle={{
          backgroundColor: '#111827',
          color: '#f3f4f6',
          border: '1px solid #4b5563',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          paddingRight: '2.5rem', // Make space for emoji button
          marginTop: '0.5rem',
          width: '100%',
          position: 'relative',
          '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)'
          }
        }}
        // Action Buttons (Reply, Edit, Delete)
        actionBtnStyle={{
          color: '#9ca3af',
          fontSize: '0.875rem',
          fontWeight: '500',
          marginRight: '1rem',
          cursor: 'pointer',
          transition: 'color 0.2s',
          '&:hover': {
            color: '#3b82f6',
            textDecoration: 'underline'
          }
        }}
        // User Info
        imgStyle={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #374151'
        }}
        // Timestamp
        timeStyle={{
          color: '#9ca3af',
          fontSize: '0.75rem',
          marginLeft: '0.5rem'
        }}
        // Username
        usernameStyle={{
          color: '#f3f4f6',
          fontWeight: '600',
          fontSize: '0.95rem',
          marginLeft: '0.5rem',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
            color: '#3b82f6'
          }
        }}
        // Event Handlers
        onSubmitAction={onSubmitAction}
        onReplyAction={onReplyAction}
        onEditAction={onEditAction}
        onDeleteAction={onDeleteAction}
        // No comments message
        customNoComment={() => (
          <div className="text-center py-8 text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        )}
        commentData={finalComments || []  }
       
      />
    </div>
  )
}
