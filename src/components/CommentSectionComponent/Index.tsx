import CommentStructure from '../CommentStructure.tsx/Index'
import InputField from '../InputField/Index'
import './CommentSection.css'
import { useContext } from 'react'
import { GlobalContext } from '../../context/Provider'
import _ from 'lodash'
import React from 'react'
import LoginSection from '../LoginSection/LoginSection'
import NoComments from './NoComments'

interface CommentSectionProps {
  overlayStyle?: object
  logIn: {
    loginLink: string
    signupLink: string
  }
  hrStyle?: object
  titleStyle?: object
  customNoComment?: Function
}

const CommentSection = ({
  overlayStyle,
  logIn,
  hrStyle,
  titleStyle,
  customNoComment
}: CommentSectionProps) => {
  const loginMode = () => {
    return (
      <LoginSection
        loginLink={logIn!.loginLink}
        signUpLink={logIn!.signupLink}
      />
    )
  }
  const globalStore: any = useContext(GlobalContext)
  console.log('globalStore', globalStore)

  const totalComments = () => {
    let count = 0
    globalStore.data.map((i: any) => {
      count = count + 1
      i.replies.map(() => (count = count + 1))
    })
    return count
  }

  return (
    <div className='overlay' style={overlayStyle}>
      <span className='comment-title' style={titleStyle}>
        {globalStore.commentsCount || totalComments()}{' '}
        {totalComments() === 1 ? 'Comment' : 'Comments'}
      </span>

      <hr className='hr-style' style={hrStyle} />
      {!globalStore.userLogged && !globalStore.currentUserData ? (
        loginMode()
      ) : (
        <InputField
          userData={globalStore.currentUserData}
          formStyle={{ margin: '10px 0px' }}
          imgDiv={{ margin: 0 }}
        />
      )}

      {globalStore.data.length > 0 ? (
        globalStore.data.map(
          (i: {
            userId: string
            comId: string
            fullName: string
            avatarUrl: string
            text: string
            userProfile?: string
            replies: Array<any> | undefined
          }) => {
            return (
              <div key={i.comId}>
                <CommentStructure
                  info={i}
                  editMode={
                    _.indexOf(globalStore.editArr, i.comId) === -1
                      ? false
                      : true
                  }
                  replyMode={
                    _.indexOf(globalStore.replyArr, i.comId) === -1
                      ? false
                      : true
                  }
                  logIn={logIn}
                />
                {i.replies &&
                  i.replies.length > 0 &&
                  i.replies.map((j) => {
                    return (
                      <div className='replySection' key={j.comId}>
                        <CommentStructure
                          info={j}
                          parentId={i.comId}
                          editMode={
                            _.indexOf(globalStore.editArr, j.comId) === -1
                              ? false
                              : true
                          }
                          replyMode={
                            _.indexOf(globalStore.replyArr, j.comId) === -1
                              ? false
                              : true
                          }
                          logIn={logIn}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          }
        )
      ) : customNoComment ? (
        customNoComment()
      ) : (
        <NoComments />
      )}
    </div>
  )
}

export default CommentSection
