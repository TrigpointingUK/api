import {MigrationInterface, QueryRunner} from "typeorm";

export class servers1648304416086 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`INSERT INTO photo_server VALUES (1, 'http://trigpointinguk-photos.s3.amazonaws.com/', 'trigpointinguk-photos', 'Amazon S3')`);
        queryRunner.query(`INSERT INTO photo_server VALUES (2, 'http://www.trigpointinguk.com/photos/', '/home/trigpoin/public_html/photos/', 'EUK Server')`);
        queryRunner.query(`INSERT INTO photo_server VALUES (3, 'http://trigpointinguk-test.s3.amazonaws.com/', 'trigpointinguk-test', 'Amazon S3 Test')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DELETE FROM photo_server WHERE id BETWEEN 1 AND 3`);

    }

}
