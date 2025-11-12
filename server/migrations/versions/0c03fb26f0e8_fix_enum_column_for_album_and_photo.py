"""Fix enum columns for album and photo safely

Revision ID: 0c03fb26f0e8
Revises: 7764f2863914
Create Date: 2025-11-12

"""
from alembic import op
import sqlalchemy as sa
import enum
from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = '0c03fb26f0e8'
down_revision: Union[str, Sequence[str], None] = '7764f2863914'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # --- Album ENUM ---
    album_status_enum = sa.Enum('active', 'archived', 'draft', name='albumstatus')
    album_status_enum.create(op.get_bind(), checkfirst=True)

    # Xóa default để tránh lỗi cast
    op.execute("ALTER TABLE albums ALTER COLUMN status DROP DEFAULT")

    # Chuẩn hóa dữ liệu cũ
    op.execute("""
        UPDATE albums
        SET status = LOWER(status)
        WHERE status IS NOT NULL
    """)

    # Chuyển cột sang enum
    op.alter_column(
        'albums',
        'status',
        existing_type=sa.String(length=50),
        type_=album_status_enum,
        existing_nullable=False,
        postgresql_using="status::albumstatus"
    )

    # Đặt lại default
    op.execute("ALTER TABLE albums ALTER COLUMN status SET DEFAULT 'active'")

    # --- Photo ENUM ---
    photo_status_enum = sa.Enum('public', 'private', 'archived', 'draft', name='photostatus')
    photo_status_enum.create(op.get_bind(), checkfirst=True)

    # Xóa default
    op.execute("ALTER TABLE photos ALTER COLUMN status DROP DEFAULT")

    # Chuẩn hóa dữ liệu cũ
    op.execute("""
        UPDATE photos
        SET status = LOWER(status)
        WHERE status IS NOT NULL
    """)

    # Chuyển cột sang enum
    op.alter_column(
        'photos',
        'status',
        existing_type=sa.String(length=50),
        type_=photo_status_enum,
        existing_nullable=False,
        postgresql_using="status::photostatus"
    )

    # Đặt lại default
    op.execute("ALTER TABLE photos ALTER COLUMN status SET DEFAULT 'draft'")


def downgrade():
    # Albums
    op.execute("ALTER TABLE albums ALTER COLUMN status DROP DEFAULT")
    op.alter_column(
        'albums',
        'status',
        existing_type=sa.Enum('active', 'archived', 'draft', name='albumstatus'),
        type_=sa.String(length=50),
        existing_nullable=False,
        postgresql_using='status::text'
    )
    op.execute("ALTER TABLE albums ALTER COLUMN status SET DEFAULT 'active'")
    op.execute('DROP TYPE IF EXISTS albumstatus')

    # Photos
    op.execute("ALTER TABLE photos ALTER COLUMN status DROP DEFAULT")
    op.alter_column(
        'photos',
        'status',
        existing_type=sa.Enum('public', 'private', 'archived', 'draft', name='photostatus'),
        type_=sa.String(length=50),
        existing_nullable=False,
        postgresql_using='status::text'
    )
    op.execute("ALTER TABLE photos ALTER COLUMN status SET DEFAULT 'draft'")
    op.execute('DROP TYPE IF EXISTS photostatus')
