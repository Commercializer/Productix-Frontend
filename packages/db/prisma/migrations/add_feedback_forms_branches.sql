-- AlterTable
ALTER TABLE "feedback_inquiries" ADD COLUMN     "branch_id" UUID,
ADD COLUMN     "feedback_form_id" UUID,
ADD COLUMN     "rating_score" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "branches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255),
    "address" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_forms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "fields" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_answers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "feedback_inquiry_id" UUID NOT NULL,
    "field_id" VARCHAR(100) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "field_type" VARCHAR(50) NOT NULL,
    "value_text" TEXT,
    "value_number" DOUBLE PRECISION,
    "value_options" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "branches_company_id_idx" ON "branches"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "branches_company_id_name_key" ON "branches"("company_id", "name");

-- CreateIndex
CREATE INDEX "feedback_forms_company_id_idx" ON "feedback_forms"("company_id");

-- CreateIndex
CREATE INDEX "feedback_answers_feedback_inquiry_id_idx" ON "feedback_answers"("feedback_inquiry_id");

-- CreateIndex
CREATE INDEX "feedback_answers_field_id_idx" ON "feedback_answers"("field_id");

-- CreateIndex
CREATE INDEX "feedback_inquiries_branch_id_idx" ON "feedback_inquiries"("branch_id");

-- AddForeignKey
ALTER TABLE "feedback_inquiries" ADD CONSTRAINT "feedback_inquiries_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_inquiries" ADD CONSTRAINT "feedback_inquiries_feedback_form_id_fkey" FOREIGN KEY ("feedback_form_id") REFERENCES "feedback_forms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_forms" ADD CONSTRAINT "feedback_forms_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_answers" ADD CONSTRAINT "feedback_answers_feedback_inquiry_id_fkey" FOREIGN KEY ("feedback_inquiry_id") REFERENCES "feedback_inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

