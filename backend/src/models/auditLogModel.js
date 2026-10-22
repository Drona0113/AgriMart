import mongoose from 'mongoose';

const auditLogSchema = mongoose.Schema(
  {
    viewerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
