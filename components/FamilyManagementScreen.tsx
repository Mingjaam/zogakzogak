import React, { useState, useEffect } from 'react';
import { useFamily } from '../contexts/FamilyContext';
import { useAuth } from '../contexts/AuthContext';

const FamilyManagementScreen: React.FC = () => {
  const { 
    families, 
    currentFamily, 
    familyMembers, 
    familyInvitations, 
    createNewFamily, 
    inviteToCurrentFamily, 
    acceptInvitation, 
    setCurrentFamily,
    isLoading 
  } = useFamily();
  const { user } = useAuth();
  
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) return;
    
    const success = await createNewFamily(newFamilyName.trim());
    if (success) {
      setNewFamilyName('');
      setShowCreateFamily(false);
    }
  };

  const handleInviteToFamily = async () => {
    if (!inviteEmail.trim()) return;
    
    const success = await inviteToCurrentFamily(inviteEmail.trim());
    if (success) {
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    await acceptInvitation(invitationId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">가족 관리</h1>
          <p className="text-gray-600">가족을 생성하고 구성원을 초대하여 함께 관리하세요.</p>
        </div>

        {/* Current Family */}
        {currentFamily && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">현재 가족</h2>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                구성원 초대
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">{currentFamily.name}</h3>
              <p className="text-sm text-blue-600">
                구성원 {familyMembers.length}명 • 생성일: {new Date(currentFamily.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Family Members */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 mb-2">구성원</h4>
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.role === 'SENIOR' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {member.role === 'SENIOR' ? '어르신' : '보호자'}
                    </span>
                    {member.isActive ? (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    ) : (
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Family List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">가족 목록</h2>
            <button
              onClick={() => setShowCreateFamily(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              새 가족 생성
            </button>
          </div>

          {families.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">아직 가족이 없습니다.</p>
              <button
                onClick={() => setShowCreateFamily(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                첫 번째 가족 생성하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {families.map((family) => (
                <div
                  key={family.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    currentFamily?.id === family.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentFamily(family)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{family.name}</h3>
                      <p className="text-sm text-gray-500">
                        구성원 {family.members.length}명
                      </p>
                    </div>
                    {currentFamily?.id === family.id && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        현재 선택됨
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Family Invitations */}
        {familyInvitations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">가족 초대</h2>
            <div className="space-y-3">
              {familyInvitations.map((invitation) => (
                <div key={invitation.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{invitation.inviteeEmail}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invitation.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : invitation.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invitation.status === 'PENDING' ? '대기 중' : 
                         invitation.status === 'ACCEPTED' ? '수락됨' : '거절됨'}
                      </span>
                      {invitation.status === 'PENDING' && (
                        <button
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                        >
                          수락
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Family Modal */}
        {showCreateFamily && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">새 가족 생성</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가족 이름
                  </label>
                  <input
                    type="text"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 김씨 가족"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateFamily}
                    disabled={!newFamilyName.trim() || isLoading}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? '생성 중...' : '생성하기'}
                  </button>
                  <button
                    onClick={() => setShowCreateFamily(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">구성원 초대</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleInviteToFamily}
                    disabled={!inviteEmail.trim() || isLoading}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? '초대 중...' : '초대하기'}
                  </button>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyManagementScreen;
