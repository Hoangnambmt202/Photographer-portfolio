"""initial models

Revision ID: fe42da593744
Revises: fd30492aae39
Create Date: 2025-12-21 21:34:03.745602

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import enum
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "fe42da593744"
down_revision: Union[str, Sequence[str], None] = "fd30492aae39"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Define enum types
class AlbumStatus(enum.Enum):
    active = "active"
    archived = "archived"
    draft = "draft"


class PhotoStatus(enum.Enum):
    public = "public"
    private = "private"
    archived = "archived"
    draft = "draft"


class ServiceStatus(enum.Enum):
    active = "active"
    inactive = "inactive"
    draft = "draft"


def upgrade() -> None:
    conn = op.get_bind()

    # === CREATE ENUM TYPES WITH CHECK ===

    # Kiểm tra nếu albumstatus enum đã tồn tại
    albumstatus_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'albumstatus'
        )
    """
    ).scalar()

    if not albumstatus_exists:
        album_status_enum = postgresql.ENUM(
            "active", "archived", "draft", name="albumstatus", create_type=True
        )
        album_status_enum.create(op.get_bind())
        print("✅ Created enum type: albumstatus")
    else:
        print("⏩ Enum type 'albumstatus' already exists, skipping...")

    # Kiểm tra nếu photostatus enum đã tồn tại
    photostatus_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'photostatus'
        )
    """
    ).scalar()

    if not photostatus_exists:
        photo_status_enum = postgresql.ENUM(
            "public",
            "private",
            "archived",
            "draft",
            name="photostatus",
            create_type=True,
        )
        photo_status_enum.create(op.get_bind())
        print("✅ Created enum type: photostatus")
    else:
        print("⏩ Enum type 'photostatus' already exists, skipping...")

    # Kiểm tra nếu servicestatus enum đã tồn tại
    servicestatus_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'servicestatus'
        )
    """
    ).scalar()

    if not servicestatus_exists:
        service_status_enum = postgresql.ENUM(
            "active", "inactive", "draft", name="servicestatus", create_type=True
        )
        service_status_enum.create(op.get_bind())
        print("✅ Created enum type: servicestatus")
    else:
        print("⏩ Enum type 'servicestatus' already exists, skipping...")

    # Sử dụng enum types đã check
    album_status_type = postgresql.ENUM(
        "active", "archived", "draft", name="albumstatus"
    )
    photo_status_type = postgresql.ENUM(
        "public", "private", "archived", "draft", name="photostatus"
    )
    service_status_type = postgresql.ENUM(
        "active", "inactive", "draft", name="servicestatus"
    )

    # === CREATE TABLES WITH EXISTENCE CHECKS ===

    # USERS TABLE
    users_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'users'
        )
    """
    ).scalar()

    if not users_exists:
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("full_name", sa.String(length=100), nullable=False),
            sa.Column("email", sa.String(length=120), nullable=False),
            sa.Column("password", sa.String(length=255), nullable=False),
            sa.Column("avatar_url", sa.String(length=255), nullable=True),
            sa.Column(
                "is_active", sa.Boolean(), server_default=sa.text("true"), nullable=True
            ),
            sa.Column(
                "is_admin", sa.Boolean(), server_default=sa.text("false"), nullable=True
            ),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("email"),
        )
        print("✅ Created table: users")
    else:
        print("⏩ Table 'users' already exists, skipping...")

    # CATEGORIES TABLE
    categories_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'categories'
        )
    """
    ).scalar()

    if not categories_exists:
        op.create_table(
            "categories",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(length=100), nullable=False),
            sa.Column("slug", sa.String(length=120), nullable=False),
            sa.Column("description", sa.String(length=255), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("name"),
            sa.UniqueConstraint("slug"),
        )
        print("✅ Created table: categories")
    else:
        print("⏩ Table 'categories' already exists, skipping...")

    # TAGS TABLE
    tags_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'tags'
        )
    """
    ).scalar()

    if not tags_exists:
        op.create_table(
            "tags",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(length=100), nullable=False),
            sa.Column("slug", sa.String(length=120), nullable=False),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("name"),
            sa.UniqueConstraint("slug"),
        )
        print("✅ Created table: tags")
    else:
        print("⏩ Table 'tags' already exists, skipping...")

    # ALBUMS TABLE
    albums_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'albums'
        )
    """
    ).scalar()

    if not albums_exists:
        op.create_table(
            "albums",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("title", sa.String(length=150), nullable=False),
            sa.Column("slug", sa.String(length=255), nullable=False),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("cover_image", sa.String(length=255), nullable=True),
            sa.Column(
                "status", album_status_type, nullable=False, server_default="active"
            ),
            sa.Column("location", sa.String(length=255), nullable=True),
            sa.Column("featured_photo_id", sa.Integer(), nullable=True),
            sa.Column("category_id", sa.Integer(), nullable=True),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("slug"),
        )
        print("✅ Created table: albums")
    else:
        print("⏩ Table 'albums' already exists, skipping...")

    # PHOTOS TABLE
    photos_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'photos'
        )
    """
    ).scalar()

    if not photos_exists:
        op.create_table(
            "photos",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("title", sa.String(length=150), nullable=True),
            sa.Column("slug", sa.String(length=150), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("image_url", sa.String(length=255), nullable=False),
            sa.Column("taken_at", sa.Date(), nullable=True),
            sa.Column("location", sa.String(length=150), nullable=True),
            sa.Column(
                "status", photo_status_type, nullable=False, server_default="draft"
            ),
            sa.Column("album_id", sa.Integer(), nullable=True),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.Column(
                "order", sa.Integer(), server_default=sa.text("0"), nullable=True
            ),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("slug"),
        )
        print("✅ Created table: photos")
    else:
        print("⏩ Table 'photos' already exists, skipping...")

    # SERVICES TABLE (tạo sau các bảng categories, users, tags)
    services_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'services'
        )
    """
    ).scalar()

    if not services_exists:
        op.create_table(
            "services",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(length=150), nullable=False),
            sa.Column("slug", sa.String(length=255), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("price", sa.Integer(), nullable=False),
            sa.Column("duration", sa.String(length=50), nullable=True),
            sa.Column("max_people", sa.Integer(), nullable=True),
            sa.Column("included_items", sa.Text(), nullable=True),
            sa.Column(
                "status", service_status_type, nullable=False, server_default="active"
            ),
            sa.Column("category_id", sa.Integer(), nullable=True),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("cover_image", sa.String(length=255), nullable=True),
            sa.Column("display_order", sa.Integer(), server_default="0", nullable=True),
            sa.Column(
                "discount_percent", sa.Integer(), server_default="0", nullable=True
            ),
            sa.Column(
                "is_featured",
                sa.Boolean(),
                server_default=sa.text("false"),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_services_id"), "services", ["id"], unique=False)
        op.create_index(op.f("ix_services_slug"), "services", ["slug"], unique=True)
        print("✅ Created table: services")
    else:
        print("⏩ Table 'services' already exists, skipping...")

    # SETTINGS TABLE
    settings_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'settings'
        )
    """
    ).scalar()

    if not settings_exists:
        op.create_table(
            "settings",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("key", sa.String(length=100), nullable=False),
            sa.Column("value", sa.Text(), nullable=False),
            sa.Column("description", sa.String(length=255), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("key"),
        )
        print("✅ Created table: settings")
    else:
        print("⏩ Table 'settings' already exists, skipping...")

    # CONTACTS TABLE
    contacts_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'contacts'
        )
    """
    ).scalar()

    if not contacts_exists:
        op.create_table(
            "contacts",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(length=100), nullable=False),
            sa.Column("email", sa.String(length=120), nullable=False),
            sa.Column("phone", sa.String(length=100), nullable=False),
            sa.Column("message", sa.Text(), nullable=False),
            sa.Column(
                "is_read", sa.Boolean(), server_default=sa.text("false"), nullable=True
            ),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        print("✅ Created table: contacts")
    else:
        print("⏩ Table 'contacts' already exists, skipping...")

    # === MANY-TO-MANY TABLES ===

    # Album Tags
    album_tags_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'album_tags'
        )
    """
    ).scalar()

    if not album_tags_exists:
        op.create_table(
            "album_tags",
            sa.Column("album_id", sa.Integer(), nullable=False),
            sa.Column("tag_id", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(["album_id"], ["albums.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["tag_id"], ["tags.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("album_id", "tag_id"),
        )
        print("✅ Created table: album_tags")
    else:
        print("⏩ Table 'album_tags' already exists, skipping...")

    # Photo Tags
    photo_tags_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'photo_tags'
        )
    """
    ).scalar()

    if not photo_tags_exists:
        op.create_table(
            "photo_tags",
            sa.Column("photo_id", sa.Integer(), nullable=False),
            sa.Column("tag_id", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(["photo_id"], ["photos.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["tag_id"], ["tags.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("photo_id", "tag_id"),
        )
        print("✅ Created table: photo_tags")
    else:
        print("⏩ Table 'photo_tags' already exists, skipping...")

    # Service Tags
    service_tags_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'service_tags'
        )
    """
    ).scalar()

    if not service_tags_exists:
        op.create_table(
            "service_tags",
            sa.Column("service_id", sa.Integer(), nullable=False),
            sa.Column("tag_id", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(
                ["service_id"], ["services.id"], ondelete="CASCADE"
            ),
            sa.ForeignKeyConstraint(["tag_id"], ["tags.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("service_id", "tag_id"),
        )
        print("✅ Created table: service_tags")
    else:
        print("⏩ Table 'service_tags' already exists, skipping...")

    # === ADD FOREIGN KEYS (with checks) ===

    # Albums foreign keys
    # Check if foreign key already exists
    fk_albums_category_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'albums' 
            AND constraint_name = 'fk_albums_category_id'
        )
    """
    ).scalar()

    if not fk_albums_category_exists:
        op.create_foreign_key(
            "fk_albums_category_id", "albums", "categories", ["category_id"], ["id"]
        )
        print("✅ Created foreign key: fk_albums_category_id")

    fk_albums_user_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'albums' 
            AND constraint_name = 'fk_albums_user_id'
        )
    """
    ).scalar()

    if not fk_albums_user_exists:
        op.create_foreign_key(
            "fk_albums_user_id", "albums", "users", ["user_id"], ["id"]
        )
        print("✅ Created foreign key: fk_albums_user_id")

    fk_albums_featured_photo_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'albums' 
            AND constraint_name = 'fk_albums_featured_photo'
        )
    """
    ).scalar()

    if not fk_albums_featured_photo_exists:
        op.create_foreign_key(
            "fk_albums_featured_photo",
            "albums",
            "photos",
            ["featured_photo_id"],
            ["id"],
            ondelete="SET NULL",
        )
        print("✅ Created foreign key: fk_albums_featured_photo")

    # Photos foreign keys
    fk_photos_album_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'photos' 
            AND constraint_name = 'fk_photos_album_id'
        )
    """
    ).scalar()

    if not fk_photos_album_exists:
        op.create_foreign_key(
            "fk_photos_album_id",
            "photos",
            "albums",
            ["album_id"],
            ["id"],
            ondelete="SET NULL",
        )
        print("✅ Created foreign key: fk_photos_album_id")

    fk_photos_user_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'photos' 
            AND constraint_name = 'fk_photos_user_id'
        )
    """
    ).scalar()

    if not fk_photos_user_exists:
        op.create_foreign_key(
            "fk_photos_user_id",
            "photos",
            "users",
            ["user_id"],
            ["id"],
            ondelete="SET NULL",
        )
        print("✅ Created foreign key: fk_photos_user_id")

    # Services foreign keys
    fk_services_category_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'services' 
            AND constraint_name = 'fk_services_category_id'
        )
    """
    ).scalar()

    if not fk_services_category_exists:
        op.create_foreign_key(
            "fk_services_category_id",
            "services",
            "categories",
            ["category_id"],
            ["id"],
        )
        print("✅ Created foreign key: fk_services_category_id")

    fk_services_user_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'services' 
            AND constraint_name = 'fk_services_user_id'
        )
    """
    ).scalar()

    if not fk_services_user_exists:
        op.create_foreign_key(
            "fk_services_user_id", "services", "users", ["user_id"], ["id"]
        )
        print("✅ Created foreign key: fk_services_user_id")

    # === CREATE ADDITIONAL INDEXES ===
    # Index cho display_order trong services
    op.create_index(
        op.f("ix_services_display_order"), "services", ["display_order"], unique=False
    )

    # Index cho is_featured trong services
    op.create_index(
        op.f("ix_services_is_featured"), "services", ["is_featured"], unique=False
    )

    # Index cho status trong các bảng
    op.create_index(op.f("ix_services_status"), "services", ["status"], unique=False)

    op.create_index(op.f("ix_albums_status"), "albums", ["status"], unique=False)

    op.create_index(op.f("ix_photos_status"), "photos", ["status"], unique=False)


def downgrade() -> None:
    # === DROP ADDITIONAL INDEXES ===
    op.drop_index(op.f("ix_photos_status"), table_name="photos")
    op.drop_index(op.f("ix_albums_status"), table_name="albums")
    op.drop_index(op.f("ix_services_status"), table_name="services")
    op.drop_index(op.f("ix_services_is_featured"), table_name="services")
    op.drop_index(op.f("ix_services_display_order"), table_name="services")

    # === DROP FOREIGN KEYS ===
    op.drop_constraint("fk_services_user_id", "services", type_="foreignkey")
    op.drop_constraint("fk_services_category_id", "services", type_="foreignkey")
    op.drop_constraint("fk_photos_user_id", "photos", type_="foreignkey")
    op.drop_constraint("fk_photos_album_id", "photos", type_="foreignkey")
    op.drop_constraint("fk_albums_featured_photo", "albums", type_="foreignkey")
    op.drop_constraint("fk_albums_user_id", "albums", type_="foreignkey")
    op.drop_constraint("fk_albums_category_id", "albums", type_="foreignkey")

    # === DROP MANY-TO-MANY TABLES ===
    op.drop_table("service_tags")
    op.drop_table("photo_tags")
    op.drop_table("album_tags")

    # === DROP MAIN TABLES ===
    op.drop_table("contacts")
    op.drop_table("settings")
    op.drop_table("services")
    op.drop_table("photos")
    op.drop_table("albums")
    op.drop_table("tags")
    op.drop_table("categories")
    op.drop_table("users")

    # === DROP ENUM TYPES (with check) ===
    conn = op.get_bind()

    # Check if enum exists before dropping
    servicestatus_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'servicestatus'
        )
    """
    ).scalar()

    if servicestatus_exists:
        service_status_enum = postgresql.ENUM(name="servicestatus")
        service_status_enum.drop(op.get_bind(), checkfirst=True)

    photostatus_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'photostatus'
        )
    """
    ).scalar()

    if photostatus_exists:
        photo_status_enum = postgresql.ENUM(name="photostatus")
        photo_status_enum.drop(op.get_bind(), checkfirst=True)

    albumstatus_exists = conn.execute(
        """
        SELECT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'albumstatus'
        )
    """
    ).scalar()

    if albumstatus_exists:
        album_status_enum = postgresql.ENUM(name="albumstatus")
        album_status_enum.drop(op.get_bind(), checkfirst=True)
