-- AlterTable
ALTER TABLE "public"."attachments" ADD COLUMN     "answer_id" TEXT,
ADD COLUMN     "question_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "public"."answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
